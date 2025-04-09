import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  UseFormReturn,
  useForm as useHookForm,
} from "react-hook-form";
import { z } from "zod";

interface UseFormOptions<T extends z.ZodType> {
  schema: T;
  defaultValues?: DefaultValues<z.infer<T>>;
  mode?: "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all";
}

export function useForm<T extends z.ZodType>({
  schema,
  defaultValues,
  mode = "onBlur",
}: UseFormOptions<T>): UseFormReturn<z.infer<T>> {
  return useHookForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode,
  });
}

// Example usage:
/*
const form = useForm({
  schema: loginSchema,
  defaultValues: {
    email: '',
    password: '',
  },
});

// In your component:
const { register, handleSubmit, formState: { errors } } = form;

const onSubmit = (data: LoginFormData) => {
  // Handle form submission
};

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <input {...register('email')} />
    {errors.email && <span>{errors.email.message}</span>}
    <input {...register('password')} type="password" />
    {errors.password && <span>{errors.password.message}</span>}
    <button type="submit">Submit</button>
  </form>
);
*/
