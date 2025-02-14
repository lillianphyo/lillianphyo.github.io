---
title: Zabbix as AWX's Dynamic Inventory
date: 2019-10-18 00:00:00 +0630
categories: [Zabbix, AWX]
tags: [Zabbix, AWX]
---

Hello! Have a nice day.

Today I am going to show you how to use Zabbix Server as Inventory Source for Ansible AWX Tower. As you know Ansible Tower allow you to set not only static inventory but also dynamic inventory. Dynamic Inventories executable programs that collect information from some external source and output the inventory in JSON format. Now, I will use Zabbix Monitoring Server as my external source to fetch inventory.
As prerequisites,  we need
 1. Ansible Tower or AWX Ansible Tower
 2. Zabbix Server
 3. And need to install Zabbix-api module
      - Zabbix-api can download [**Here**](https://files.pythonhosted.org/packages/e3/ed/2092731880f0de5b07067fc446dc0fc5166f2ee98018b6d524cd3e28a69d/zabbix-api-0.5.4.tar.gz):
      - $pip install zabbix-api-version.tar.gz
As first Step, we are going to fetch zabbix.py which is dynamic inventory script contributed for Ansible project. Copy and paste the script in TowerUI/Inventory Scripts/CREATE INVENTORY SCRIPT /CUSTOM SCRIPT
<https://raw.githubusercontent.com/ansible/ansible/devel/contrib/inventory/zabbix.py>

![Window shadow](/posts/20191018/one.png){: .shadow width="500" height="500" style="max-width: 90%" }

Then update self value and save INVENTORY SCRIPT as follow:
```bash
def __init__(self):

        self.defaultgroup = 'group_all'
        self.zabbix_server = 'http://zabbix_server_ip'
        self.zabbix_username = 'Admin'
        self.zabbix_password = 'Admin_Password'
        self.validate_certs = True
        self.read_host_inventory = False
        self.use_host_interface = True
```

Create NEW INVENTORY from Tower/Inventories/Create a new inventory/Invnetory/ and Saved it.

![Window shadow](/posts/20191018/two.png){: .shadow width="500" height="500" style="max-width: 90%" }

I created new source via SOURCE tab. SOURCE value can choose other on-prem or cloud infrastructure management servers but this time I choose Custom Script.

![Window shadow](/posts/20191018/three.png){: .shadow width="500" height="500" style="max-width: 90%" }

Later Start sync process to fetch Zabbix Host and Host group configuration as Inventory.

![Window shadow](/posts/20191018/four.png){: .shadow width="500" height="500" style="max-width: 90%" }

If cloud icon turn green, can use this inventory source from zabbix to your templates and workflows.

![Window shadow](/posts/20191018/five.png){: .shadow width="500" height="500" style="max-width: 90%" }

