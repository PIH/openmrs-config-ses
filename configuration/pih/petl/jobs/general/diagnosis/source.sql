select encounter_type_id into @tb_general from encounter_type where uuid= 'aa42cc6c-b9ee-4850-926c-dda4bb14d890'; --50 tb intake
select encounter_type_id into @covid_general from encounter_type where uuid='8d50b938-dcf9-4b8e-9938-e625bd2f0a81'; --45 covid-19 admission
select encounter_type_id into @hiv_general from encounter_type where uuid='c31d306a-40c4-11e7-a919-92ebcb67fe33'; --30 hiv intake

drop temporary table if exists temp_diagnosis;
create temporary table temp_diagnosis
(
especialidad  varchar(20),
frecuencia_dias int,
frecuencia_semana int,
frecuencia_mes int,
frecuencia_manana int,
frecuencia_tarde int
);

set @YEAR=YEAR(NOW());
set @diaslaborales=datediff(NOW(),CONCAT(YEAR(NOW()), '-01-01'))/365*251;

insert into temp_diagnosis (especialidad,frecuencia_dias,frecuencia_semana,frecuencia_mes,frecuencia_manana,frecuencia_tarde)
select 'tuberculosis',(count(encounter_type))/@diaslaborales as frecuencia_dia,
(count(encounter_type)/(WEEK(MAX(encounter_datetime)) - WEEK(MIN(encounter_datetime))+1)) as frecuencia_semana,
(count(encounter_type)/(MONTH(MAX(encounter_datetime))-MONTH(MIN(encounter_datetime))+1)) as frecuencia_mes,
(select count(encounter_type)/@diaslaborales from encounter where HOUR (encounter_datetime) BETWEEN 00 AND 11 AND MINUTE (encounter_datetime) BETWEEN 00 AND 59 )as frecuencia_manana,
(select count(encounter_type)/@diaslaborales from encounter where HOUR (encounter_datetime) BETWEEN 12 AND 23 AND MINUTE (encounter_datetime) BETWEEN 00 AND 59 ) as frecuencia_tarde
from encounter
where encounter_type=@tb_general and YEAR(encounter_datetime) = @YEAR;

insert into temp_diagnosis (especialidad,frecuencia_dias,frecuencia_semana,frecuencia_mes,frecuencia_manana,frecuencia_tarde)
select 'covid',(count(encounter_type))/@diaslaborales as frecuencia_dia,
(count(encounter_type)/(WEEK(MAX(encounter_datetime)) - WEEK(MIN(encounter_datetime))+1)) as frecuencia_semana,
(count(encounter_type)/(MONTH(MAX(encounter_datetime))-MONTH(MIN(encounter_datetime))+1)) as frecuencia_mes,
(select count(encounter_type)/@diaslaborales from encounter where HOUR (encounter_datetime) BETWEEN 00 AND 11 AND MINUTE (encounter_datetime) BETWEEN 00 AND 59 )as frecuencia_manana,
(select count(encounter_type)/@diaslaborales from encounter where HOUR (encounter_datetime) BETWEEN 12 AND 23 AND MINUTE (encounter_datetime) BETWEEN 00 AND 59 ) as frecuencia_tarde
from encounter
where encounter_type=@covid_general and YEAR(encounter_datetime) = @YEAR;

insert into temp_diagnosis (especialidad,frecuencia_dias,frecuencia_semana,frecuencia_mes,frecuencia_manana,frecuencia_tarde)
select 'hiv',(count(encounter_type))/@diaslaborales as frecuencia_dia,
(count(encounter_type)/(WEEK(MAX(encounter_datetime)) - WEEK(MIN(encounter_datetime))+1)) as frecuencia_semana,
(count(encounter_type)/(MONTH(MAX(encounter_datetime))-MONTH(MIN(encounter_datetime))+1)) as frecuencia_mes,
(select count(encounter_type)/@diaslaborales from encounter where HOUR (encounter_datetime) BETWEEN 00 AND 11 AND MINUTE (encounter_datetime) BETWEEN 00 AND 59 )as frecuencia_manana,
(select count(encounter_type)/@diaslaborales from encounter where HOUR (encounter_datetime) BETWEEN 12 AND 23 AND MINUTE (encounter_datetime) BETWEEN 00 AND 59 ) as frecuencia_tarde
from encounter
where encounter_type=@hiv_general and YEAR(encounter_datetime) = @YEAR;

select 
especialidad,
frecuencia_dias,
frecuencia_semana,
frecuencia_mes,
frecuencia_manana,
frecuencia_tarde
from temp_diagnosis;
