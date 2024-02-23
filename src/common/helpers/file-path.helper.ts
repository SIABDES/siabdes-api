type AvailableResourceLocation = 'journals' | 'ppn';

type GetResourceBasePathArgs = {
  resource: AvailableResourceLocation;
  unitId: string;
  bumdesId: string;
};

type GetResourcePathArgs = GetResourceBasePathArgs & {
  fileKey: string;
};

export function getResourceBasePath(args: GetResourceBasePathArgs) {
  const { resource, unitId, bumdesId } = args;

  return `${bumdesId}/${unitId}/${resource}` as const;
}

export function getResourcePath(args: GetResourcePathArgs) {
  const { fileKey, ...rest } = args;
  const basePath = getResourceBasePath(rest);

  return `${basePath}/${fileKey}` as const;
}
