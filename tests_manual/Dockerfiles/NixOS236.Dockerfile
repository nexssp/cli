FROM nixos/nix:2.3.6

RUN nix-channel --add https://nixos.org/channels/nixpkgs-unstable nixpkgs
RUN nix-channel --update

RUN nix-shell -p nodejs-12

CMD ["/bin/bash"]