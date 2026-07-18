create table classroom_members(
    id int auto_increment primary key,
    classroom_id int not null,
    student_id int not null,
    joined_at timestamp default current_timestamp,
    constraint fk_member_classroom
    foreign key (classroom_id)
    references classrooms(id)
    on delete cascade,
    constraint fk_member_student
    foreign key (student_id)
    references users(id)
    on delete cascade,
    constraint uq_classroom_student
    unique(classroom_id, student_id)
);