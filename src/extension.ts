import { Maybe } from './lib/types';
import init from './lib/lichessARC';

/**
 * Instead of checking whether the .rendered class has been added to the #challenge-app element,
 * we are getting the parent element of challenge app (a div w/ no ID) and watching it's childlist.
 * We have to do this because when the #challenge-app element is "rendered" it is actually being
 * replaced with a new element with the .rendered class added.
 */

const CHALLENGE_APP_ROOT: Maybe<HTMLElement> = document.getElementById('challenge-app')?.parentElement;

if (CHALLENGE_APP_ROOT) {
  const observer = new MutationObserver((mutations: MutationRecord[], thisObserver) => {
    mutations.forEach((m) => {
      m.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          if (node.id === 'challenge-app') {
            thisObserver.disconnect();
            init(node);
          }
        }
      });
    });
  });

  observer.observe(CHALLENGE_APP_ROOT, { childList: true });
} else {
  console.error('#challenge-app element not found.');
}


