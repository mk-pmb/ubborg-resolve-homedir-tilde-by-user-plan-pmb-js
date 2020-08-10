// -*- coding: utf-8, tab-width: 2 -*-

import mustBe from 'typechecks-pmb/must-be';
import splitOnce from 'split-string-or-buffer-once-pmb';
import getOwn from 'getown';

const hdResType = 'osUser';
const hdProp = 'homeDirPath';

async function resolveHomeDirTildeByUserPlan(spawnCtx, path, defaultUserName) {
  mustBe.nest('path', path);
  mustBe('undef | nonEmpty str', 'defaultUserName')(defaultUserName);
  if (!path.startsWith('~')) { return path; }
  const [hduExplicitName, subPath] = (splitOnce('/', path.slice(1)) || []);
  const hduName = (hduExplicitName || defaultUserName || '');
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
  const reso = (hdPath + (subPath === undefined ? '' : '/') + (subPath || ''));
  return reso;
}

export default resolveHomeDirTildeByUserPlan;
