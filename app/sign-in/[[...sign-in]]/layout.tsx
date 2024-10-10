export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center">
      <div className=" w-full text-center justify-center">{children}</div>
    </section>
  );
}
