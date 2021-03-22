import { SubSet, SubListAPIResponse, Maybe, TwitchSub } from './types';

const API_URL: string = 'https://tvdhout.com/ericrosen/get/';

/**
 * Type guard function verifying unknown objects are lists of strings.
 * @param object Some object that may or may not be a valid list of subscriber names.
 * @returns Type guard varifying that response is a list of strings.
 */
const isSublistAPIResponse = (object: unknown): object is SubListAPIResponse =>
  Array.isArray(object) && object.every((e) => typeof e === 'string');

export default (container: HTMLElement) => {
  /**
   *
   * @param challengerElement
   * @returns
   */
  const getChallengerName: (e: HTMLElement) => TwitchSub = (challengerElement) => {
    const challengerName = challengerElement
      .querySelector<HTMLElement>('.user-link')
      ?.innerText.split(' ')[0]
      .toLowerCase();
    if (!challengerName) {
      throw Error('.user-link element not found.');
    }
    return challengerName;
  };

  /**
   *
   * @returns
   */
  const getSubs = async (): Promise<SubSet> =>
    new Promise((resolve: (s: SubListAPIResponse) => void, reject: (r: void) => void) => {
      const cachedSubs: Maybe<string> = window.sessionStorage.getItem('TWITCH_SUBS');
      if (!cachedSubs) {
        reject();
      } else {
        const sublist: unknown = JSON.parse(cachedSubs);
        if (isSublistAPIResponse(sublist)) {
          resolve(sublist);
        }
      }
    })
      .catch(async () => {
        console.log('Fetching subs...');
        const resp: string = await fetch(API_URL, { method: 'GET' }).then((r) => r.text());
        const subs: SubListAPIResponse = resp.toLowerCase().trim().split(/\s+/);

        window.sessionStorage.setItem('TWITCH_SUBS', JSON.stringify(subs));
        return subs;
      })
      .then((subs: Array<string>) => new Set(subs));

  const setNameColors: () => void = () => {
    getSubs()
      .then((subs: SubSet) => {
        Array.from(container.querySelectorAll<HTMLElement>('.challenge'))
          .filter((challengerElement) => subs.has(getChallengerName(challengerElement)))
          .forEach((challengerElement) => {
            const userLink = challengerElement.querySelector<HTMLElement>('.user-link');

            if (!userLink) {
              throw new Error('.user-link element not found.');
            }

            userLink.style.color = '#9e84ce';
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const acceptChallenge = () => {
    const challenges = container.querySelectorAll('.challenge');
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    const acceptButton = challenge.querySelector<HTMLElement>('.accept');

    if (acceptButton) {
      acceptButton.click();
    } else {
      throw new Error('.accept element not found.');
    }
  };

  /**
  Function and service by Stockvis.
  Queries the database of IMRosen subs with their lichess handles and filters challenges.
  */
  const acceptSubChallenge = () => {
    const challenges: Array<HTMLElement> = Array.from(container.querySelectorAll<HTMLElement>('.challenge'));

    getSubs()
      .then((subs) => {
        const subChallenges = challenges.filter((challenger: HTMLElement) => {
          const challengerName = getChallengerName(challenger);
          return subs.has(challengerName);
        });

        if (subChallenges.length > 0) {
          const challenge = subChallenges[Math.floor(Math.random() * subChallenges.length)];
          const acceptButton = challenge.querySelector<HTMLElement>('.accept');
          if (acceptButton) {
            acceptButton.click();
          } else {
            throw new Error('.accept element not found.');
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const declineAllChallenges = () => {
    Array.from(container.querySelectorAll<HTMLElement>('.challenge'), (challengeElement) =>
      challengeElement.querySelector<HTMLElement>('.decline'),
    ).forEach((declineButton: Maybe<HTMLElement>) => {
      if (declineButton) declineButton.click();
    });
  };

  const buttonContainer = document.createDocumentFragment();
  const div = document.createElement('div');
  div.innerText = 'Accept random challenge';
  div.id = 'lichess-arc';
  div.onclick = acceptChallenge;
  buttonContainer.append(div);

  const subDiv = document.createElement('div');
  subDiv.innerText = 'Accept subscriber challenge';
  subDiv.id = 'lichess-arc-sub';
  subDiv.onclick = acceptSubChallenge;
  buttonContainer.append(subDiv);

  const declineDiv = document.createElement('div');
  declineDiv.innerText = 'Decline Challenges';
  declineDiv.id = 'lichess-arc-decline-all';
  declineDiv.onclick = () => declineAllChallenges;
  buttonContainer.append(declineDiv);

  setNameColors();

  container.prepend(buttonContainer);
};
