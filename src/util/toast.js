import Swal from 'sweetalert2';

/**
 * Clean, theme-matched toast notification
 * @param {string} title - The message to display
 * @param {'success' | 'error' | 'warning' | 'info' | 'question'} icon - The icon to show
 */
export const showToast = (title) => {
  Swal.fire({
    toast: true,
    position: 'bottom',
    title: title,
    showConfirmButton: false,
    timer: 2000,
    background: 'rgba(3, 7, 18, 0.9)',
    color: '#cbd5e1',
    width: 'auto',
    padding: '4px 16px',
    showClass: {
      popup: 'animate__animated animate__fadeInUp animate__faster',
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutDown animate__faster',
    },
    customClass: {
      popup: 'rounded-full border border-white/5 shadow-lg backdrop-blur-md mb-10 mx-auto',
      title: 'text-[12px] font-medium tracking-normal m-0 p-0',
    },
  });
};
