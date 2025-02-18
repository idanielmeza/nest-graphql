import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { RolesEnum } from 'src/auth/enums/roles.enums';
import { BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('users')
export class User {

  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  fullName: string;

  @Field()
  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Field(() => [String])
  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  roles: RolesEnum[];


  @Field(() => Boolean)
  @Column({
    type: 'boolean',
    default: true
  })
  isActive: boolean;


  // lastUserUpdated
  @ManyToOne(() => User, user => user.lastUserUpdated, {nullable: true})
  @JoinColumn()
  @Field(() => User, {nullable: true})
  lastUserUpdated: User;

  @Column({ type: 'timestamp', nullable: true })
  lastUpdated: Date;


  @BeforeUpdate()
  updateTimestamp() {
    this.lastUpdated = new Date();
  }
}
