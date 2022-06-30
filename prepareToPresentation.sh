yarn build;
rm -rf /mnt/ext/home/lukas/workspace/php/presentation/public/admin; 
mkdir /mnt/ext/home/lukas/workspace/php/presentation/public/admin; 
cp -r build/static /mnt/ext/home/lukas/workspace/php/presentation/public/admin/static; 
find /mnt/ext/home/lukas/workspace/php/presentation/public/admin/static/ -type f -name *map -exec rm {} +
