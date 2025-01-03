const copyToClipboard = async (
  data: string,
  onSuccess: (value: void) => void | PromiseLike<void>,
  onFail: () => void | PromiseLike<void>
) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(data).then(onSuccess, () => {
      const fallback = fallbackCopyToClipboard(data, onSuccess);
      if (!fallback) onFail();
    });
  } else {
    const fallback = fallbackCopyToClipboard(data, onSuccess);
    if (!fallback) onFail();
  }
};

// Hacky way to allow copying to clipboard using the old way (execCommand). This allowed copying to clipboard on Metamask in the past, not sure if it still works :).
const fallbackCopyToClipboard = (
  data: string,
  onSuccess: (value: void) => void | PromiseLike<void>
) => {
  var textArea = document.createElement("textarea");
  textArea.value = data;
  textArea.setAttribute("readonly", "true");

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  let successful = false;

  try {
    successful = document.execCommand("copy");
    if (successful) onSuccess();
  } catch (err) {
    successful = false;
  }

  document.body.removeChild(textArea);
  return successful;
};

export { copyToClipboard };
