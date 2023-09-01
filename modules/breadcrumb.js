import { ref } from "vue";

export default function useBreadcrumb() {
  const breadcrumb = ref({});

  function setBreadcrumb(value) {
    window.dispatchEvent(
      new CustomEvent("breadcrumb-updated", {
        detail: {
          storage: value,
        },
      })
    );
  }

  function getBreadcrumb() {
    window.addEventListener("breadcrumb-updated", (event) => {
      breadcrumb.value = event.detail.storage;
    });
  }

  return {
    breadcrumb,

    setBreadcrumb,
    getBreadcrumb,
  };
}
