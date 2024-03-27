const Search = 'search';
const List = 'get';
const Detail = 'get/:id';
const Create = 'create';
const Update = 'update';
const Delete = 'delete/:id';

export const Routes = {
  AuthSign: {
    ApiTags: `auth`,
    Controller: `auth`,
    SignIn: 'sign-in',
    SignUp: 'sign-up',
  },

  ToDo: {
    ApiTags: `todo`,
    Controller: `todo`,
    List,
    Detail,
    Create,
    Update,
    Delete,
  },
};
