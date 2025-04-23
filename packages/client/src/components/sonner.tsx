import { Toaster as Sonner } from 'sonner';
import { useTheme } from './hooks/useTheme';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();
  return (
    <Sonner
      className="toaster group"
      data-theme={theme}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: 'alert alert-soft',
          error: 'alert-error',
          success: 'alert-success',
          warning: 'alert-warning',
          info: 'alert-info',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
