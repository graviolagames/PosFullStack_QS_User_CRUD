import './App.css';
import { Admin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { UserList, UserEdit, UserCreate } from './users/users';

const dataProvider = jsonServerProvider('http://127.0.0.1:3001');
const App = () => <Admin dataProvider={dataProvider}>
    <Resource name="users" list={UserList} edit = {UserEdit} create = {UserCreate}/>
</Admin>;

export default App;