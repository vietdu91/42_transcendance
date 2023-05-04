import { Entity, Column, PrimaryGeneratedColumn } from 'prisma';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

    @Column()
    password: string;

  @Column()
  lastName: string;

    @Column()
    email: string;

  @Column({ default: true })
  isActive: boolean;
}