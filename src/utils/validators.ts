const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type RegisterErrors = Partial<Record<keyof RegisterFormValues, string>>;

export function validateRegister(values: RegisterFormValues): RegisterErrors {
  const errors: RegisterErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Vui lòng nhập họ tên.';
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = 'Họ tên quá ngắn.';
  }

  if (!values.email.trim()) {
    errors.email = 'Vui lòng nhập email.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Email không đúng định dạng.';
  }

  if (!values.password) {
    errors.password = 'Vui lòng nhập mật khẩu.';
  } else if (values.password.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Vui lòng nhập lại mật khẩu.';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Mật khẩu nhập lại không khớp.';
  }

  return errors;
}

export function validateLogin(
  email: string,
  password: string,
): Partial<{email: string; password: string}> {
  const errors: Partial<{email: string; password: string}> = {};

  if (!email.trim()) {
    errors.email = 'Vui lòng nhập email.';
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Email không đúng định dạng.';
  }

  if (!password) {
    errors.password = 'Vui lòng nhập mật khẩu.';
  }

  return errors;
}
