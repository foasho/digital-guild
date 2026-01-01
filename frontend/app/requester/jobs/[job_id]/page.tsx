type Props = {
  params: Promise<{ job_id: string }>;
};

export default async function JobDetailPage({ params }: Props) {
  const { job_id } = await params;

  return (
    <div>
      <h1>Job Detail</h1>
      <p>Job ID: {job_id}</p>
    </div>
  );
}
