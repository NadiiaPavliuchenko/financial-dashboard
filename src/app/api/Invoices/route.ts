import { connectToDatabase } from '../db';
import Invoice from '../../models/Invoice';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    const invoice = await Invoice.find({})
      .sort({ date: -1 })
      .limit(5)
      .populate('customer_id', 'name email image_url');

    if (invoice.length === 0) {
      console.log('No data found in Invoice collection.');
    }
    return NextResponse.json(invoice, { status: 200 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
}

// export async function fetchInvoicesPages(query: string) {
//   try {
//     const count = await Invoice.countDocuments({
//       $or: [
//         { 'customer.name': { $regex: query, $options: 'i' } },
//         { 'customer.email': { $regex: query, $options: 'i' } },
//         { amount: { $regex: query, $options: 'i' } },
//         { date: { $regex: query, $options: 'i' } },
//         { status: { $regex: query, $options: 'i' } },
//       ],
//     });

//     return Math.ceil(count / ITEMS_PER_PAGE);
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch total number of invoices.');
//   }
// }

// export async function fetchInvoiceById(_id: string) {
//   try {
//     const invoice = await Invoice.findById(_id).exec();

//     if (!invoice) {
//       throw new Error('Invoice not found');
//     }

//     return {
//       ...invoice.toObject(),
//       amount: invoice.amount / 100,
//     };
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch invoice.');
//   }
// }
