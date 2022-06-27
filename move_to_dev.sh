#bash
for var in "$@"
do
    yarn remove $var; 
    yarn add --dev $var;
done

