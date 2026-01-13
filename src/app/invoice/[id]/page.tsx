import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import InvoiceDetailView from "@/components/InvoiceDetailView"; // Import the new component

type Props = {
  params: Promise<{ id: string }> | { id: string };
};

export default async function InvoiceDetailsPage({ params }: Props) {
  // 1. Resolve Params
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) return notFound();

  // 2. Fetch Data
  const invoice = await prisma.invoice.findUnique({
    where: { id: id },
  });

  if (!invoice) return notFound();

  // 3. Render the Client Component
  return <InvoiceDetailView invoice={invoice} />;
}