import { UserRole } from '@nx-angular-nestjs-authentication/models';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ unique: true, nullable: false })
    username: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Exclude()
    @Column({ nullable: false })
    password: string;

    @Column({ type: 'text', default: UserRole.USER })
    role: UserRole;

    @Exclude()
    @Column({ nullable: true })
    verificationToken: string;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ nullable: true })
    verifiedAt: Date;

    @Exclude()
    @Column({ nullable: true })
    resetPasswordToken: string;

    @Exclude()
    @Column({ nullable: true })
    resetPasswordTokenExpirationDate: Date;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}
