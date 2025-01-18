'use server';

import { z } from 'zod';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Invoice from '../models/Invoice';
// import { signIn } from '@/auth';
// import { AuthError } from 'next-auth';

const FormSchema = z.object({
  id: z.string(),
  customer_id: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
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

export async function createInvoice(formData: FormData) {
  const { customer_id, amount, status } = CreateInvoice.parse({
    customer_id: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
  console.log(customer_id, amountInCents, status);

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

export async function editInvoice(id: string, formData: FormData) {
  const { customer_id, amount, status } = UpdateInvoice.parse({
    customer_id: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
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
