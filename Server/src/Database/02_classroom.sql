create table classrooms(
    id int auto_increment primary key,
    teacher_id int not null,
    classroom_name varchar(255) not null,
    description text,
    join_code varchar(20)  not null unique,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
     on update current_timestamp,
     constraint fk_classroom_teacher
     foreign key (teacher_id)
     references users(id) 
     on delete cascade
);