$env:PGPASSWORD = '123456'
psql -U postgres -h localhost -p 5432 -d content_db -c "SELECT code, name, grade FROM subject LIMIT 10;"
