const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

export const pdfStringToFileUrl = (data: string): string => {
  const byteNumbers = new Array(data.length);
  for (let i = 0; i < data.length; i++) {
    byteNumbers[i] = data.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const file = new Blob([byteArray], { type: 'application/pdf;base64' });
  return URL.createObjectURL(file);
};

export const isPdf = (data: string): boolean => {
  try {
    return !!data.match(/^.PDF-([0-9.]+)/)[1];
  } catch (e) {
    return false;
  }
};

export const isBase64 = (maybe64: string): boolean => {
  return base64regex.test(maybe64);
};

export const toBase64 = (file: Blob) =>
  new Promise((resolve, reject) => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    }
  });
