let toastSetter: ((
    newMessage: string,
    options?: {
      backgroundColor?: string;
      color?: string;
      ttl?: number;
    }
  ) => void) | null = null;

export function setToastSetter(
  setter: ((
    newMessage: string,
    options?: {
      backgroundColor?: string;
      color?: string;
      ttl?: number;
    }
  ) => void)
) {
  toastSetter = setter;
}

export function triggerToast(
  message: string,
  {
    backgroundColor = 'red',
    color = 'white',
    ttl ,
  }: {
    backgroundColor?: string;
    color?: string;
    ttl?: number;
  } = {}
) {
  if (!toastSetter) {
    console.warn("Toast setter not initialized");
    return;
  }

  toastSetter(message,{
    backgroundColor,
    color,
    ttl,
  });
}
