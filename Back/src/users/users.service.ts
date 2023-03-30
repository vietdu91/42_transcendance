import { Injectable } from '@nestjs/common';

export type User = {
    id: number;
    name: string;
    username: string;
    password: string;
}; 



@Injectable()
export class UsersService {
    private readonly users: User[] = [ 
        {
            id: 1,
            name: 'benda',
            username: 'benda',
            password: 'test',
        },
        {
            id: 2,
            name: 'ben',
            username: 'ben',
            password: '1234',
        },
    ];

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username === username);
        }
    }
    
