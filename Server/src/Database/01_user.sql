create table users(
    id int auto_increment primary key ,
    name varchar(255) not null,
    email varchar(255) not null unique,
    password varchar(255) not null,
    role enum('teacher', 'student') not null,
    profile_image varchar(500),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP

)