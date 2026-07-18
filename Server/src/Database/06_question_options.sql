create table question_options(
    id int auto_increment primary key,
    question_id int not null,
    option_text text not null,
    is_correct boolean default false,
    display_order int not null,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
        constraint fk_option_question
        foreign key (question_id)
        references questions(id)
        on delete cascade
);