import { Create, Datagrid, DateField, DateInput, Edit, List, SimpleForm, TextField, TextInput } from "react-admin";

export const UserList = (data) => (
    <List>
        <Datagrid data={data.data} rowClick="edit">
            <TextField source="userId" />
            <TextField source="name" />
            <TextField source="email" />
            <TextField source="password" />
        </Datagrid>
    </List>
);

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="email" />
            <TextInput source="password" />
        </SimpleForm>
    </Edit>
);
/*
export const EventCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="date" />
        </SimpleForm>
    </Create>
);
*/