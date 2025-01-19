'use server';

import { z } from 'zod';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Invoice from '../models/Invoice';
import { signIn } from '../../../auth';
import { AuthError } from 'next-auth';

const FormSchema = z.object({
  id: z.string(),
  customer_id: z.string({
    invalid_type_error: 'Please select a customer',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ date: true, id: true });

export type State = {
  errors?: {
    customer_id?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customer_id: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customer_id, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await Invoice.create({
      customer_id: customer_id,
      amount: amountInCents,
      status: status,
      date: date,
    });
  } catch (error) {
    console.error('Database Error: Failed to Create Invoice.');
  }
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function editInvoice(
  id: string,
  prevSate: State,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customer_id: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customer_id, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await Invoice.findByIdAndUpdate(
      { _id: id },
      {
        customer_id: customer_id,
        amount: amountInCents,
        status: status,
      }
    );
  } catch (error) {
    console.error('Database Error: Failed to Update Invoice.');
  }
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await Invoice.findByIdAndDelete({ _id: id });
  } catch (error) {
    console.error('Database Error: Failed to Delete Invoice.');
  }
  revalidatePath('/dashboard/invoices');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
