from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in buying_house/__init__.py
from buying_house import __version__ as version

setup(
	name="buying_house",
	version=version,
	description="Buying House",
	author="safdar211@gmail.com",
	author_email="safdar211@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
