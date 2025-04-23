import { toast } from 'sonner';
import { useTheme } from '../components/hooks/useTheme';
import { useBackend } from '../components/lib/BackendProvider';
import { Github } from 'lucide-react';

export default function Home() {
  const { theme, setTheme } = useTheme();
  const { api } = useBackend();

  const callBackend = async () => {
    const { data, error } = await api.test.get();
    if (error) {
      toast.error(
        "Backend server seems to not be running. Check it's availability.",
      );
    } else {
      toast.success(data);
    }
  };

  return (
    <div className="self-center w-full items-center justify-center flex flex-col h-screen">
      <a
        className="btn btn-sm absolute top-4"
        href="https://github.com/crqch/rspack-react-elysia-boilerplate/"
        target="_blank"
        rel="noreferrer"
      >
        <Github className="w-4 h-4" />
        Source code
      </a>
      <button
        onClick={() => {
          setTheme(theme === 'cyberworld' ? 'oatmilk' : 'cyberworld');
        }}
        className="btn btn-square absolute top-4 right-4"
        type="button"
      >
        {theme === 'oatmilk' ? '🌑' : '☀️'}
      </button>
      <p className="text-3xl font-light tracking-tighter mb-8">
        rspack-react-elysia-boilerplate
      </p>
      <button
        onMouseDown={callBackend}
        className="btn btn-primary btn-lg mt-8"
        type="submit"
      >
        Backend call
      </button>
      <p className="mt-16 opacity-50">Websites of used libraries:</p>
      <div className="flex flex-row mt-2 gap-4">
        <a
          className="btn btn-neutral"
          href="https://daisyui.com/"
          target="_blank"
          rel="noreferrer"
        >
          🌼 DaisyUI
        </a>
        <a
          className="btn btn-neutral"
          href="https://tailwindcss.com/"
          target="_blank"
          rel="noreferrer"
        >
          💙 TailwindCSS
        </a>
        <a
          className="btn btn-neutral"
          href="https://elysiajs.com/"
          target="_blank"
          rel="noreferrer"
        >
          🌸 ElysiaJS
        </a>
      </div>

      <p className="absolute bottom-4 opacity-50">
        Made with 🎶 by{' '}
        <a target="_blank" rel="noreferrer" href="//crqch.vercel.app/">
          crqch
        </a>
      </p>
    </div>
  );
}
