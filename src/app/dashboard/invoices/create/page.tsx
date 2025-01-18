import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';

export default async function Page() {
  const customers = await fetchCustomers();
  const simpleCustomers = JSON.stringify(customers);
  //   const simpleCustomers = customers.map(({ _id, name }) => ({
  //     _id,
  //     name,
  //   }));
  //   console.log(simpleCustomers);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={simpleCustomers} />
    </main>
  );
}
