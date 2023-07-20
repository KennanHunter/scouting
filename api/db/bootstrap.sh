read -r -p "Are you sure? This will wipe the DB and create a new schema. [Y/n] " response
response=${response,,} # tolower
if [[ $response =~ ^(y| ) ]] || [[ -z $response ]]; then
    pnpm wrangler d1 execute scouting-db --file=./db/schema.sql
fi

