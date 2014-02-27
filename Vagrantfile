# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
 
  config.vm.box = "precise64"
  
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"
 
  config.vm.network :forwarded_port, guest: 80, host: 7777  
  
  config.vm.provision :shell, :path => "bootstrap.sh"
 
end