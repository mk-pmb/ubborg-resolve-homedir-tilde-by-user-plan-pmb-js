// -*- coding: utf-8, tab-width: 2 -*-

import getOwn from 'getown';
import isStr from 'is-string';
import mustBe from 'typechecks-pmb/must-be';
import splitOnce from 'split-string-or-buffer-once-pmb';

const hdResType = 'osUserLogin';
const hdProp = 'homeDirPath';
const preferredUserNameProp = 'defaultUserName';


const EX = async function resolveHomeDirTildeByUserPlan(spawnCtx, path, opt) {
  mustBe.nest('path  ', path);

  const nopt = EX.normalizeOptionsObject(opt);
  const pun = nopt[preferredUserNameProp];
  const dun = (pun
    || nopt.enforcedOwner
    || nopt.owner
    || pun); // <-- Repeat in order to ensure correct error message.
  mustBe('undef | nonEmpty str', preferredUserNameProp)(dun);

  // Check path only when opt was ok, in order to not conceal opt errors.
  if (!path.startsWith('~')) { return path; }

  let [hduName, subPath] = (splitOnce('/', path.slice(1)) || []);
  hduName = (hduName || dun || '');
  const hdPath = await EX.findHomeDirPath(spawnCtx, hduName, nopt);
  mustBe.nest('home directory path for ' + hduName, hdPath);
  subPath = (subPath || '');
  const reso = (hdPath + (subPath && '/') + subPath);
  return reso;
};


Object.assign(EX, {

  normalizeOptionsObject(opt) {
    if (isStr(opt)) { return { defaultUserName: opt }; }
    if (!opt) { return false; }
    return opt;
  },

  async findHomeDirPath(spawnCtx, hduName, opt) {
    const pathOverride = getOwn(opt.homeDirPaths, hduName);
    if (pathOverride) { return pathOverride; }

    const userPlans = getOwn(spawnCtx.getResPlanPrByTypeName(), hdResType);
    const hduPlan = await getOwn(userPlans, hduName);
    if (!hduPlan) {
      const fail = ('Cannot lookup ' + hdProp + ' of ' + hdResType
        + '[' + hduName + ']: Resource is not planned yet.');
      throw new Error(fail);
    }
    await hduPlan.hatchedPr;
    const facts = await hduPlan.toFactsDict();
    const hdPath = facts[hdProp];
    return hdPath;
  },

});


export default EX;
