## Loop

```sh
for i in {1..100}; do nexss.js Id --nxsAs="A" | nexss.js Id --nxsAs="B" | \
nexss.js Id --nxsAs="C"; date ; sleep 1; done
```

## Few in pipe

<code>
nexss Id --nxsAs=MY1 | node nexss.js Id --nxsAs=MY2 | node nexss.js Id --nxsAs=MY3 | node nexss.js Id --nxsAs=MY4 | node nexss.js Id --nxsAs=MY5 | node nexss Id --nxsAs=MY6
</code>

## Longer commands

<code>

nexss Id --nxsAs=MY1 | nexss Id --nxsAs=MY2 | nexss Id --nxsAs=MY3 | nexss Id --nxsAs=MY4 | nexss Id --nxsAs=MY5 | nexss Id --nxsAs=MY6 | nexss Id --nxsAs=MY7 | nexss Id --nxsAs=MY8 | nexss Id --nxsAs=MY9 | nexss Id --nxsAs=MY10 | nexss Id --nxsAs=MY11 | nexss Id --nxsAs=MY12 | nexss Id --nxsAs=MYx1 | nexss Id --nxsAs=MYx2 | nexss Id --nxsAs=MYx3 | nexss Id --nxsAs=MYx4 | nexss Id --nxsAs=MYx5 | nexss Id --nxsAs=MYx6 | nexss Id --nxsAs=MYx7 | nexss Id --nxsAs=MYx8 | nexss Id --nxsAs=MYx9 | nexss Id --nxsAs=MYx10 | nexss Id --nxsAs=MYx11 | nexss Id --nxsAs=MYx12
</code>
