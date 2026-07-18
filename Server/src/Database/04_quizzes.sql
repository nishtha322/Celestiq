create table quizzes(
    id int auto_increment primary key,
    classroom_id int not null,
    title varchar(255) not null,
    description text,
    duration int not null,
    status enum('draft', 'published','live','ended') default 'draft',
    start_time datetime,
    end_time datetime,
    shuffle_questions boolean default false,
    shuffle_options boolean default false,
    allow_review boolean default true,
    max_attempts int default 1,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
    on update current_timestamp,
    constraint fk_quiz_classroom
     foreign key (classroom_id)
     references classrooms(id)
     on delete cascade
);