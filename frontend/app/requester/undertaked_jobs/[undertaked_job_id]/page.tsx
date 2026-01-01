type Props = {
  params: Promise<{ undertaked_job_id: string }>;
};

export default async function UndertakedJobDetailPage({ params }: Props) {
  const { undertaked_job_id } = await params;

  return (
    <div>
      <h1>Undertaked Job Detail</h1>
      <p>Undertaked Job ID: {undertaked_job_id}</p>
    </div>
  );
}
