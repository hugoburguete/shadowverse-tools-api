export type GQLRequestFields<Name extends string, Children> = {
  name: Name;
  children: Children[];
};
