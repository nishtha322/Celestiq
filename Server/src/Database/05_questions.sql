create table questions(
    id int auto_increment primary key,
    quiz_id int not null,
    question_text text not null,
    question_type enum(
        'single_correct',
        'multiple_correct',
        'true_false'
    ) not null,
    marks int default 1,
    negative_marks decimal(4,2) default 0.00,
    explanation text,
    display_order int not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
    on update current_timestamp,
    constraint fk_question_quiz
    foreign key (quiz_id)
    REFERENCES  quizzes(id)
    on delete cascade
);