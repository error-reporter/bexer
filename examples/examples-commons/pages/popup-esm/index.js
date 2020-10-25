chrome.runtime.getBackgroundPage(async (bgWindow) => {
  await bgWindow.Bexer.installGlobalHandlersOnAsync(
    { hostWindow: globalThis, nameForDebug: 'PUP' },
  );
  const { timeouted } = bgWindow.Bexer.Utils;

  document.getElementById('btn').onclick = () => {

    throw new Error('ONCLK!');

  };

  throw new TypeError('FROM POPUP!');
});
