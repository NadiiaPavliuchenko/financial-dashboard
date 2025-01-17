import { connectToDatabase } from '../db';
import Revenue from '../../models/Revenue';
import { NextResponse } from 'next/server';

// const ITEMS_PER_PAGE = 6;

export async function GET() {
  try {
    await connectToDatabase();
    const revenue = await Revenue.find();
    if (revenue.length === 0) {
      console.log('No data found in Revenue collection.');
    }

    return NextResponse.json(revenue, { status: 200 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
}

// export async function fetchLatestInvoices() {
//   try {
//     const latestInvoices = await Invoice.find({})
//       .sort({ date: -1 })
//       .limit(5)
//       .populate('customer_id', 'name email image_url')
//       .exec();

//     return latestInvoices.map((invoice) => ({
//       ...invoice.toObject(),
//       amount: formatCurrency(invoice.amount),
//     }));
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch the latest invoices.');
//   }
// }

// export async function fetchFilteredInvoices(
//   query: string,
//   currentPage: number
// ) {
//   const offset = (currentPage - 1) * ITEMS_PER_PAGE;

//   try {
//     const invoices = await Invoice.find({
//       $or: [
//         { 'customer.name': { $regex: query, $options: 'i' } },
//         { 'customer.email': { $regex: query, $options: 'i' } },
//         { amount: { $regex: query, $options: 'i' } },
//         { date: { $regex: query, $options: 'i' } },
//         { status: { $regex: query, $options: 'i' } },
//       ],
//     })
//       .skip(offset)
//       .limit(ITEMS_PER_PAGE)
//       .populate('customer_id', 'name email image_url')
//       .exec();

//     return invoices;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch invoices.');
//   }
// }

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

// export async function fetchCustomers() {
//   try {
//     const customers = await Customer.find({}).sort({ name: 1 }).exec();
//     return customers;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all customers.');
//   }
// }

// export async function fetchFilteredCustomers(query: string) {
//   try {
//     const customers = await Customer.aggregate([
//       {
//         $match: {
//           $or: [
//             { name: { $regex: query, $options: 'i' } },
//             { email: { $regex: query, $options: 'i' } },
//           ],
//         },
//       },
//       {
//         $lookup: {
//           from: 'invoices',
//           localField: '_id',
//           foreignField: 'customer_id',
//           as: 'invoices',
//         },
//       },
//       {
//         $project: {
//           name: 1,
//           email: 1,
//           image_url: 1,
//           total_invoices: { $size: '$invoices' },
//           total_pending: {
//             $sum: {
//               $cond: [
//                 { $eq: ['$invoices.status', 'pending'] },
//                 '$invoices.amount',
//                 0,
//               ],
//             },
//           },
//           total_paid: {
//             $sum: {
//               $cond: [
//                 { $eq: ['$invoices.status', 'paid'] },
//                 '$invoices.amount',
//                 0,
//               ],
//             },
//           },
//         },
//       },
//     ]);

//     return customers.map((customer) => ({
//       ...customer,
//       total_pending: formatCurrency(customer.total_pending),
//       total_paid: formatCurrency(customer.total_paid),
//     }));
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch customer table.');
//   }
// }
