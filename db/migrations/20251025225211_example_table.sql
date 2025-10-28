-- migrate:up
create table example (
    uuid       char(36)     not null primary key,
    name       varchar(255) not null,
    createdAt datetime(3)  not null,
    updatedAt datetime(3)  not null
) charset = utf8mb4
  engine = InnoDB;

-- migrate:down
drop table example;
