links_arr=()

echo -n "Enter your link: "
read link
echo "You entered $link"

link_arr=($link)

while [ ${#link_arr[@]} -gt 0 ]
do
  for j in ${link_arr[@]} ;
  do
    iter_arr=()
    link_str="$(wget -qO- $j |grep -Eoi '<a [^>]+>' | grep -Eo 'href="[^\"]+"' | grep -Eo '(http|https)://[^/"]+')"
    IFS=$' '; arr=( "$link_str" );
    for i in ${arr[@]} ; 
    do 
      if [[ " ${links_arr[*]} " != " $i " ]]; then
        iter_arr+=($i)
        links_arr+=($i)
      fi
    done
  done
  link_arr=("${iter_arr[@]}")
done

echo "Scrap link"
echo "$links_arr"
