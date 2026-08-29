export default function PageHero({ title, subtitle }) {
  return (
    <section className="bg-navy-800 py-14 text-white">
      <div className="container-page">
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-white/70">{subtitle}</p>}
      </div>
    </section>
  );
}
