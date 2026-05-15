type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SyllabusPage({ params }: PageProps) {
  const { slug } = await params;
  const examName = slug.replaceAll("-", " ");

  return (
    <main className="min-h-screen bg-white px-4 py-6 text-slate-950">
      <section className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold capitalize">
          {examName} Syllabus
        </h1>
        <p className="mt-3 text-slate-600">
          Detailed syllabus content will be added here.
        </p>
      </section>
    </main>
  );
}
