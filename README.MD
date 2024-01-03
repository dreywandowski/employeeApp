<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://dreywandowski.ng/images/office.jpg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href=""><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href=""><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href=""><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href=""><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

##  Complete HR - Backend

Employee management application, backend APIs created with Node js + Express + Sequelize ORM (MySQL)
 Features include:

URL: <a target="_blank" href="http://employee.dreywandowski.ng/api"> Complete HR - Backend </a>
#
## Modules
<ul>
<li> Employee Module</li>
<li> Leave Application Module</li>
<li> Jobs Portal </li>
</ul>

#
## Features implemented includes:
1. ORM system employed to manage database operations [Sequeilze ORM]
2. CORS handled to manage cross-origin requests
3. Rate-limiting to reduce server loads 
4. Caching system to reduce latency
5. MVC architecture employed for structure and easy debugging
6. Cron jobs to automate simple HR tasks
7. New user verification to prevent spam regsitrations.

#
## Documentation available at: https://dreywandowski.ng/api_documentations/employee_portal/


### Changes to Implement
application stages 
archived -- 0
in view -- 1
first interview -- 2
second interview -- 3
hire - 4

1. Add Department column to jobs. 
2. Add application status (0,1,2,3,4,5) , portfolio link to apllications table
3. Add employee id (UUID) to users table
4. Create controller to change application status as referenced in (2).
5. Immediately the job status on (4) is changed to 5 (approved for hire), automatically create an interview date
6.  Immediately the job status on (4) is changed to 2 (first interview), automatically send an interview email to applicant
