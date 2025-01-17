import { formatCurrency } from '@/app/lib/utils';
import Customer from '@/app/models/Customer';
import Invoice from '@/app/models/Invoice';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [invoiceCount, customerCount, invoiceStatus] = await Promise.all([
      Invoice.countDocuments(),
      Customer.countDocuments(),
      Invoice.aggregate([
        {
          $group: {
            _id: '$status',
            totalAmount: { $sum: '$amount' },
          },
        },
      ]),
    ]);

    const statusData = invoiceStatus.reduce(
      (acc, status) => {
        acc[status._id] = formatCurrency(status.totalAmount);
        return acc;
      },
      { paid: '0', pending: '0' }
    );

    const card = {
      numberOfInvoices: invoiceCount,
      numberOfCustomers: customerCount,
      totalPaidInvoices: statusData.paid,
      totalPendingInvoices: statusData.pending,
    };

    return NextResponse.json(card, { status: 200 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
}
