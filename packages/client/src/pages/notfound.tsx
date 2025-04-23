export default function NotFound() {
  return (
    <div className="self-center w-full items-center justify-center flex flex-col h-screen">
      <p className="text-[30rem] absolute pointer-events-none opacity-[0.02] top-[0rem] font-black">
        404
      </p>
      <p className="font-bold text-2xl">This page has not been found</p>
      <a href="/" className="btn mt-8">
        Go to home page
      </a>
    </div>
  );
}
