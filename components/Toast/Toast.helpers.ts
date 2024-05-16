import toast from 'react-hot-toast';


export const toastCallAux = (title: string, success: boolean) => {
  if (success) {
    toast.success(title);
  } else {
    toast.error(title);
  }
};
